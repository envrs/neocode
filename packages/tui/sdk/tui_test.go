// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package neocode_test

import (
	"context"
	"errors"
	"os"
	"testing"

	"github.com/neopilot-ai/neocode-sdk-go"
	"github.com/neopilot-ai/neocode-sdk-go/internal/testutil"
	"github.com/neopilot-ai/neocode-sdk-go/option"
)

func TestTuiAppendPrompt(t *testing.T) {
	t.Skip("skipped: tests are disabled for the time being")
	baseURL := "http://localhost:4010"
	if envURL, ok := os.LookupEnv("TEST_API_BASE_URL"); ok {
		baseURL = envURL
	}
	if !testutil.CheckTestServer(t, baseURL) {
		return
	}
	client := neocode.NewClient(
		option.WithBaseURL(baseURL),
	)
	_, err := client.Tui.AppendPrompt(context.TODO(), neocode.TuiAppendPromptParams{
		Text: neocode.F("text"),
	})
	if err != nil {
		var apierr *neocode.Error
		if errors.As(err, &apierr) {
			t.Log(string(apierr.DumpRequest(true)))
		}
		t.Fatalf("err should be nil: %s", err.Error())
	}
}

func TestTuiOpenHelp(t *testing.T) {
	t.Skip("skipped: tests are disabled for the time being")
	baseURL := "http://localhost:4010"
	if envURL, ok := os.LookupEnv("TEST_API_BASE_URL"); ok {
		baseURL = envURL
	}
	if !testutil.CheckTestServer(t, baseURL) {
		return
	}
	client := neocode.NewClient(
		option.WithBaseURL(baseURL),
	)
	_, err := client.Tui.OpenHelp(context.TODO())
	if err != nil {
		var apierr *neocode.Error
		if errors.As(err, &apierr) {
			t.Log(string(apierr.DumpRequest(true)))
		}
		t.Fatalf("err should be nil: %s", err.Error())
	}
}
